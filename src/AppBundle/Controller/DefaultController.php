<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Choice;
use AppBundle\Form\NumberChoiceType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     * @Template("default/index.html.twig")
     */
    public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $valueCounts = $em->getRepository(Choice::class)->findValueCounts();

        return array(
            'valueCounts' => $valueCounts,
        );
    }

    /**
     * @Route("/pick-a-number-modal", name="pick_a_number_modal")
     * @Template("default/modal.html.twig")
     */
    public function modalAction(Request $request)
    {
        $choice = new Choice();

        $form = $this->createForm(NumberChoiceType::class, $choice, array(
                'action' => $this->generateUrl('pick_a_number_modal'),
            ))
            ->add('submit', SubmitType::class, array('label' => 'Submit'));

        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($choice);
            $em->flush();

            return $this->redirectToRoute('homepage');
        }

        return array(
            'form' => $form->createView(),
        );
    }
}
