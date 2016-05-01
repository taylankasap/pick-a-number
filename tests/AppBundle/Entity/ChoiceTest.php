<?php

namespace Tests\AppBundle\Entity;

use AppBundle\Entity\Choice;

class ChoiceTest extends \PHPUnit_Framework_TestCase
{
    public function testId()
    {
        $choice = new Choice();

        $this->assertNull($choice->getId());
    }

    public function testValue()
    {
        $choice = new Choice();

        $this->assertNull($choice->getValue());

        $choice->setValue(1);
        $this->assertEquals(1, $choice->getValue());

        $choice->setValue(2);
        $this->assertEquals(2, $choice->getValue());

        $choice->setValue(null);
        $this->assertNull($choice->getValue());
    }
}
